<?php

namespace App\Http\Controllers;

use App\Http\Resources\PromotionCollection;
use App\Models\Promotion;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new PromotionCollection(Promotion::all());
    }

}
