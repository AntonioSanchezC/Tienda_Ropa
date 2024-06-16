<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImgProductCollection;
use App\Models\ImgProduct;

class ImgProductController extends Controller
{
    public function index() {

        return new ImgProductCollection(ImgProduct::all());
    }
}
