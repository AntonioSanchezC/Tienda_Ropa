<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Img extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'entity'
    ];


    public function products()
    {
        return $this->belongsToMany(Product::class, 'img_products', 'img_id', 'product_id');
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
