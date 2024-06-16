<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubCategoryCollection;
use App\Models\SubCategory;
class SubCategoryController extends Controller
{
    public function index()  {

        return new SubCategoryCollection(SubCategory::all());

    }
}

