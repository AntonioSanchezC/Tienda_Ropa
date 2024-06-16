<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;


    protected $fillable = [
        'name',
        'tipe',
        'description',
        'discount',
        'status',
        'id_imgs'

    ];
}
