<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray($request)
    {
        return $this->collection->map(function($order) {
            return [
                'id' => $order->id,
                'code' => $order->code,
                'total' => $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
                'user' => [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'lastName' => $order->user->lastName,
                    'address' => $order->user->address,
                    'email' => $order->user->email,
                ],
                'products' => $order->products->map(function($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'quantity' => $product->pivot->quantity,
                        'price' => $product->price, // Assuming you have a price field in the products table
                    ];
                })->toArray(), // Convert the products collection to array
            ];
        })->toArray(); // Convert the orders collection to array
    }
}
