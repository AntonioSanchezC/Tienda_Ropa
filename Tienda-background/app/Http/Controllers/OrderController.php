<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Http\Resources\OrderCollection;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailBill;
use App\Models\Arrival;
use App\Models\Delivery;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Warehouse;
use App\Models\warehouses_products;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Cargar las relaciones 'user' y 'products' junto con los pedidos
        $orders = Order::with(['user', 'products'])->where('status', 0)->get();

        // Retornar la colección de pedidos
        return new OrderCollection($orders);
    }



    public function deliveries($orderId)
    {
        try {
            $deliveries = Delivery::with(['warehouse', 'arrival'])
                ->where('order_id', $orderId)
                ->get();

            return response()->json([
                'message' => 'Deliveries fetched successfully',
                'deliveries' => $deliveries
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getUserOrders(Request $request)
    {
        $user = auth()->user();

        $orders = Order::where('user_id', $user->id)
            ->with([
                'deliveries.warehouse', // Asegura que se incluye el warehouse
                'deliveries.arrival'    // Asegura que se incluye el arrival
            ])
            ->get();

        return response()->json([
            'message' => 'User orders with deliveries fetched successfully',
            'orders' => $orders,
        ]);
    }







    /**
     * Store a newly created resource in storage.
     */


     private function calculateTravelDuration($startCoord, $endCoord)
     {
         $client = new Client();
         $apiKey = '5b3ce3597851110001cf6248145b41f1ce724712bb94e2b0f00f2fb4';

         // Combina las coordenadas en un formato adecuado para la API
         $coordinates = [
             [$startCoord['latitude'], $startCoord['longitude']],
             [$endCoord['latitude'], $endCoord['longitude']]
         ];

         $response = $client->post("https://api.openrouteservice.org/v2/directions/driving-car", [
             'headers' => [
                 'Content-Type' => 'application/json',
                 'Authorization' => 'Bearer ' . $apiKey,
             ],
             'json' => [
                 'coordinates' => $coordinates,
             ],
         ]);

         $data = json_decode($response->getBody()->getContents(), true);
         $durationInSeconds = $data['routes'][0]['summary']['duration'];

         return $durationInSeconds;
     }
     public function store(OrderRequest $request)
     {
         $logs = []; // Array para almacenar los logs

         try {
             $validated = $request->validated();
             $logs[] = 'Validated Data: ' . json_encode($validated);

             // Crear una nueva instancia de Order
             $order = new Order;
             $order->user_id = Auth::user()->id;
             $order->total = $validated['total'];
             $order->code = $this->generateUniqueCode();
             $order->save();

             $logs[] = 'Order Created: ' . $order->id;

             // Obtener el ID del pedido
             $orderId = $order->id;

             // Obtener el ID del arrival o punto de entrega
             $arrivalId = $validated['arrivalId'];

             // Obtener los productos del pedido
             $products = $validated['products'];

             foreach ($products as $product) {
                 $logs[] = 'Processing Product: ' . json_encode($product);

                 $productCode = $product['product_code'];
                 $colorId = $product['color'];
                 $sizeId = $product['size'];

                 try {
                     // Buscar productos coincidentes en la base de datos
                     $matchedProducts = DB::table('products')
                         ->join('product_color', 'products.id', '=', 'product_color.product_id')
                         ->join('product_size', 'products.id', '=', 'product_size.product_id')
                         ->where('product_color.color_id', $colorId)
                         ->where('product_size.size_id', $sizeId)
                         ->where('products.product_code', $productCode)
                         ->select('products.id')
                         ->get();

                     $logs[] = 'Matched Products: ' . json_encode($matchedProducts);

                     // Obtener los almacenes relacionados con los productos coincidentes
                     $warehouseProducts = DB::table('warehouses_products')
                         ->whereIn('product_id', $matchedProducts->pluck('id'))
                         ->get();

                     $logs[] = 'Warehouse Products: ' . json_encode($warehouseProducts);

                     // Obtener las coordenadas del almacén y otra información relevante
                     $warehouseIds = $warehouseProducts->pluck('warehouse_id')->unique();
                     $warehouses = Warehouse::whereIn('id', $warehouseIds)->get();

                     $logs[] = 'Warehouses: ' . json_encode($warehouses);

                     $warehouseCoordinates = [];

                     foreach ($warehouses as $warehouse) {
                         $warehouseCoordinates[] = [
                             'latitude' => $warehouse->latitude,
                             'longitude' => $warehouse->longitude,
                             'id' => $warehouse->id,
                             'address' => $warehouse->address,
                         ];
                     }

                     $logs[] = 'Warehouse Coordinates: ' . json_encode($warehouseCoordinates);

                     // Obtener las coordenadas del punto de llegada
                     $arrival = Arrival::find($arrivalId);
                     if (!$arrival) {
                         throw new \Exception('Arrival not found');
                     }

                     $arrivalCoordinates = [$arrival->latitude, $arrival->longitude];

                     $logs[] = 'Arrival Coordinates: ' . json_encode($arrivalCoordinates);

                     // Calcular las duraciones de viaje desde cada almacén hasta el punto de llegada
                     $durations = [];
                     foreach ($warehouseCoordinates as $warehouseData) {
                         $duration = $this->calculateTravelDuration(
                             ['latitude' => $warehouseData['latitude'], 'longitude' => $warehouseData['longitude']],
                             ['latitude' => $arrivalCoordinates[0], 'longitude' => $arrivalCoordinates[1]]
                         );
                         $durations[] = [
                             'warehouse_id' => $warehouseData['id'],
                             'duration' => $duration,
                             'address' => $warehouseData['address']
                         ];
                     }

                     $logs[] = 'Durations: ' . json_encode($durations);

                     // Obtener el almacén más cercano
                     $closestWarehouse = collect($durations)->sortBy('duration')->first();

                     if (!$closestWarehouse) {
                         throw new \Exception('No closest warehouse found');
                     }

                     $logs[] = 'Closest Warehouse: ' . json_encode($closestWarehouse);

                     // Registrar la entrega con el almacén más cercano
                     $departureTime = now();
                     $arrivalTime = $departureTime->copy()->addSeconds($closestWarehouse['duration']);

                     // Crear una entrada en la tabla 'deliveries'
                     $delivery = new Delivery;
                     $delivery->order_id = $orderId;
                     $delivery->arrival_id = $arrivalId;
                     $delivery->warehouse_id = $closestWarehouse['warehouse_id'];
                     $delivery->departure_time = $departureTime;
                     $delivery->departure = $closestWarehouse['address'];
                     $delivery->arrival_time = $arrivalTime;
                     $delivery->save();

                     $logs[] = 'Delivery Created: ' . json_encode($delivery);

                     // Registrar los productos en la tabla 'order_products'
                     $order->products()->attach($product['id'], ['quantity' => $product['quantity']]);

                     $logs[] = 'Order Product Saved: ' . json_encode($product);

                 } catch (\Exception $e) {
                     $logs[] = 'Error processing product: ' . $e->getMessage();
                 }
             }

             // Preparar la información para el email
             $orderBill = [];
             foreach ($products as $productBill) {
                 $orderBill[] = [
                     'quantity' => $productBill['quantity'],
                     'name' => $productBill['name'],
                     'price' => $productBill['price'],
                     'price_total' => $validated['total'],
                     'code' => $order->code,
                 ];
             }

             $email = Auth::user()->email;

             // Crea una instancia del Mailable y establece el mensaje
             $emailMailable = new EmailBill($orderBill);

             // Envía el correo electrónico utilizando el Mailable
             Mail::to($email)->send($emailMailable);

             return response()->json([
                 'message' => 'Pedido realizado correctamente, estará listo en unos minutos',
                 'arrivalCoordinates' => $arrivalCoordinates,
                 'warehouseCoordinates' => $warehouseCoordinates,
                 'logs' => $logs // Incluir los logs en la respuesta
             ], 200);

         } catch (\Exception $e) {
             $logs[] = 'Error al procesar el pedido: ' . $e->getMessage();
             return response()->json([
                 'message' => 'Error en la creación del pedido',
                 'error' => $e->getMessage(),
                 'logs' => $logs // Incluir los logs en la respuesta en caso de error
             ], 500);
         }
     }


     public function storeOrder($data)
     {
         $logs = []; // Array para almacenar los logs

         try {
             // Crear una nueva instancia de Order
             $order = new Order;
             $order->user_id = Auth::user()->id;
             $order->total = $data['total'];
             $order->code = $this->generateUniqueCode();
             $order->paypal_order_id = $data['paypal_order_id'];
             $order->status = true;
             $order->save();

             $logs[] = 'Order Created: ' . $order->id;

             // Obtener el ID del pedido
             $orderId = $order->id;

             // Obtener el ID del arrival o punto de entrega
             $arrivalId = $data['arrivalId'];

             // Obtener los productos del pedido
             $products = $data['products'];

             foreach ($products as $product) {
                 $logs[] = 'Processing Product: ' . json_encode($product);

                 $productCode = $product['product_code'];
                 $colorId = $product['color'];
                 $sizeId = $product['size'];

                 try {
                     // Buscar productos coincidentes en la base de datos
                     $matchedProducts = DB::table('products')
                         ->join('product_color', 'products.id', '=', 'product_color.product_id')
                         ->join('product_size', 'products.id', '=', 'product_size.product_id')
                         ->where('product_color.color_id', $colorId)
                         ->where('product_size.size_id', $sizeId)
                         ->where('products.product_code', $productCode)
                         ->select('products.id')
                         ->get();

                     $logs[] = 'Matched Products: ' . json_encode($matchedProducts);

                     // Obtener los almacenes relacionados con los productos coincidentes
                     $warehouseProducts = DB::table('warehouses_products')
                         ->whereIn('product_id', $matchedProducts->pluck('id'))
                         ->get();

                     $logs[] = 'Warehouse Products: ' . json_encode($warehouseProducts);

                     // Obtener las coordenadas del almacén y otra información relevante
                     $warehouseIds = $warehouseProducts->pluck('warehouse_id')->unique();
                     $warehouses = Warehouse::whereIn('id', $warehouseIds)->get();

                     $logs[] = 'Warehouses: ' . json_encode($warehouses);

                     $warehouseCoordinates = [];

                     foreach ($warehouses as $warehouse) {
                         $warehouseCoordinates[] = [
                             'latitude' => $warehouse->latitude,
                             'longitude' => $warehouse->longitude,
                             'id' => $warehouse->id,
                             'address' => $warehouse->address,
                         ];
                     }

                     $logs[] = 'Warehouse Coordinates: ' . json_encode($warehouseCoordinates);

                     // Obtener las coordenadas del punto de llegada
                     $arrival = Arrival::find($arrivalId);
                     if (!$arrival) {
                         throw new \Exception('Arrival not found');
                     }

                     $arrivalCoordinates = [$arrival->latitude, $arrival->longitude];

                     $logs[] = 'Arrival Coordinates: ' . json_encode($arrivalCoordinates);

                     // Calcular las duraciones de viaje desde cada almacén hasta el punto de llegada
                     $durations = [];
                     foreach ($warehouseCoordinates as $warehouseData) {
                         $duration = $this->calculateTravelDuration(
                             ['latitude' => $warehouseData['latitude'], 'longitude' => $warehouseData['longitude']],
                             ['latitude' => $arrivalCoordinates[0], 'longitude' => $arrivalCoordinates[1]]
                         );
                         $durations[] = [
                             'warehouse_id' => $warehouseData['id'],
                             'duration' => $duration,
                             'address' => $warehouseData['address']
                         ];
                     }

                     $logs[] = 'Durations: ' . json_encode($durations);

                     // Obtener el almacén más cercano
                     $closestWarehouse = collect($durations)->sortBy('duration')->first();

                     if (!$closestWarehouse) {
                         throw new \Exception('No closest warehouse found');
                     }

                     $logs[] = 'Closest Warehouse: ' . json_encode($closestWarehouse);

                     // Registrar la entrega con el almacén más cercano
                     $departureTime = now();
                     $arrivalTime = $departureTime->copy()->addSeconds($closestWarehouse['duration']);

                     // Crear una entrada en la tabla 'deliveries'
                     $delivery = new Delivery;
                     $delivery->order_id = $orderId;
                     $delivery->arrival_id = $arrivalId;
                     $delivery->warehouse_id = $closestWarehouse['warehouse_id'];
                     $delivery->departure_time = $departureTime;
                     $delivery->departure = $closestWarehouse['address'];
                     $delivery->arrival_time = $arrivalTime;
                     $delivery->save();

                     $logs[] = 'Delivery Created: ' . json_encode($delivery);

                     // Registrar los productos en la tabla 'order_products'
                     $order->products()->attach($product['id'], ['quantity' => $product['quantity']]);

                     $logs[] = 'Order Product Saved: ' . json_encode($product);

                 } catch (\Exception $e) {
                     $logs[] = 'Error processing product: ' . $e->getMessage();
                 }
             }

             // Preparar la información para el email
             $orderBill = [];
             foreach ($products as $productBill) {
                 $orderBill[] = [
                     'quantity' => $productBill['quantity'],
                     'name' => $productBill['name'],
                     'price' => $productBill['price'],
                     'price_total' => $data['total'],
                     'code' => $order->code,
                 ];
             }

             $email = Auth::user()->email;

             // Crea una instancia del Mailable y establece el mensaje
             $emailMailable = new EmailBill($orderBill);

             // Envía el correo electrónico utilizando el Mailable
             Mail::to($email)->send($emailMailable);

             return [
                 'message' => 'Pedido realizado correctamente, estará listo en unos minutos',
                 'arrivalCoordinates' => $arrivalCoordinates,
                 'warehouseCoordinates' => $warehouseCoordinates,
                 'logs' => $logs // Incluir los logs en la respuesta
             ];

         } catch (\Exception $e) {
             $logs[] = 'Error al procesar el pedido: ' . $e->getMessage();
             return [
                 'message' => 'Error en la creación del pedido',
                 'error' => $e->getMessage(),
                 'logs' => $logs // Incluir los logs en la respuesta en caso de error
             ];
         }
     }



          /**
      * Genera un código único para el pedido.
      *
      * @return int
      */
     private function generateUniqueCode()
     {
         do {
             // Generar un número aleatorio de 5 dígitos
             $code = mt_rand(10000, 99999);
         } while (Order::where('code', $code)->exists());

         return $code;
     }



    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update()
    {
        //

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
