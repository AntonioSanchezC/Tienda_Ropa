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
    public function getPromotionsByGender($gender)
    {
        try {
            $promotions = Promotion::where('gender', $gender)->get();
            return response()->json(['data' => $promotions], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
