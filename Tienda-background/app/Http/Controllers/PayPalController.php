<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Http\Controllers\OrdenController;
use App\Models\OrderProduct;
use Illuminate\Http\Request;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\Payer;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;
use PayPal\Api\Amount;
use PayPal\Api\Capture;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PayPalController extends Controller
{
    private $apiContext;

    public function __construct()
    {
        // Configuración del API Context de PayPal
        $this->apiContext = new ApiContext(
            new OAuthTokenCredential(
                'AZFdIK3fHvxMgCVr91s9ldQVcTDi_8W7A8dizMdec2vv9Vwy-QmyjxElqKQqT5eYLYVvEZtnowFDrQYV',     // Reemplazar con tu Client ID de PayPal
                'EFz1Dim0p0IAzZwMIIGJiesSK35PV1cc4CFm_Dwl8zZWXd1Lox8RdA9ds8XGuo7LA2-YfdJFPrsiKEDi'  // Reemplazar con tu Secret de PayPal
            )
        );

        // Configuración de ambiente (sandbox o producción)
        $this->apiContext->setConfig([
            'mode' => 'sandbox', // 'sandbox' para pruebas, 'live' para producción
        ]);
    }

    public function createOrder(Request $request)
    {
        $payer = new Payer();
        $payer->setPaymentMethod('paypal');

        $amount = new Amount();
        $amount->setCurrency('USD')
               ->setTotal($request->total);

        $transaction = new Transaction();
        $transaction->setAmount($amount)
                    ->setDescription('Purchase from Your Store');

        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl(route('order.capture'))
                     ->setCancelUrl(route('order.cancel'));

        $payment = new Payment();
        $payment->setIntent('sale')
                ->setPayer($payer)
                ->setTransactions([$transaction])
                ->setRedirectUrls($redirectUrls);

        try {
            $payment->create($this->apiContext);

            return response()->json(['id' => $payment->getId()]);
        } catch (\Exception $ex) {
            return response()->json(['error' => $ex->getMessage()]);
        }
    }

    public function captureOrder(Request $request)
    {
        try {
            // Obtener los datos del request
            $paymentId = $request->input('paymentID');
            $payerId = $request->input('payerID');
            $total = $request->input('total');
            $products = $request->input('products');
            $arrivalId = $request->input('arrivalId');

            // Crear una nueva orden
            $order = new Order();
            $order->paypal_order_id = $paymentId;
            $order->payer_id = $payerId;
            $order->total = $total;
            $order->arrival_id = $arrivalId;
            $order->save();

            // Guardar los productos de la orden
            foreach ($products as $product) {
                $orderProduct = new OrderProduct();
                $orderProduct->order_id = $order->id;
                $orderProduct->product_id = $product['id'];
                $orderProduct->quantity = $product['quantity'];
                $orderProduct->price = $product['price'];
                $orderProduct->color = $product['color'];
                $orderProduct->size = $product['size'];
                $orderProduct->product_code = $product['product_code'];
                $orderProduct->save();
            }

            return response()->json([
                'message' => 'Orden capturada y registrada correctamente',
                'paymentId' => $paymentId,
                'payerId' => $payerId,
                'total' => $total,
                'products' => $products,
                'arrivalId' => $arrivalId,
            ]);

        } catch (\Exception $e) {
            Log::error('Error capturing order', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Error al capturar y registrar la orden',
                'message' => $e->getMessage()
            ], 500);
        }
    }



}
