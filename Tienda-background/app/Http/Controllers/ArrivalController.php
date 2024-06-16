<?php

namespace App\Http\Controllers;

use App\Http\Resources\ArrivalCollection;
use App\Models\Arrival;
use Illuminate\Http\Request;

class ArrivalController extends Controller
{

    public function index() {

        return new ArrivalCollection(Arrival::all());
    }

}
