<?php

namespace App\Http\Controllers;

use App\Http\Resources\PrefixCollection;
use App\Models\Prefix;

class PrefixController extends Controller
{
    public function index()
    {
        return new PrefixCollection(Prefix::all());

    }
}
