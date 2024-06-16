<?php

namespace App\Http\Controllers;

use App\Http\Resources\PromotionProductCollection;
use App\Models\PromotionProduct;

class PromoProductsController extends Controller
{
    public function index() {

        return new PromotionProductCollection(PromotionProduct::all());
    }
}
