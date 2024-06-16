<?php

namespace App\Http\Controllers;

use App\Http\Resources\WarehouseCollection;
use App\Http\Resources\WarehousesProductsCollection;
use App\Models\warehouses_products;
use Illuminate\Http\Request;

class WarehousesProductsController extends Controller
{
    public function index() {

        return new WarehousesProductsCollection(warehouses_products::all());

    }
}
