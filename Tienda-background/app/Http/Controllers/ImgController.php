<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImgCollection;
use App\Models\Img;
use Illuminate\Http\Request;

class ImgController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new ImgCollection(Img::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Img $img)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Img $img)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Img $img)
    {
        //
    }
}
