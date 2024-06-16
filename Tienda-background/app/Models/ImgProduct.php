<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImgProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'img_id',
        'product_id',
    ];

    public function img()
    {
        return $this->belongsTo(Img::class, 'img_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
