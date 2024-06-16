<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'gender',
        'price',
        'description',
        'available',
        'quantity',
        'searched',
        'sub_categories_id',
        'novelty',
        'product_code'
    ];

    public static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            try {
                // Verifica si ya existe un producto con el mismo nombre
                $existingProduct = Product::where('name', $product->name)->first();

                if ($existingProduct) {
                    // Si existe, usa el mismo código de producto
                    $product->product_code = $existingProduct->product_code;
                } else {
                    // Si no existe, genera un nuevo código de producto único
                    $baseCode = strtoupper(Str::substr($product->name, 0, 3));
                    $uniqueCode = $baseCode . '-' . Str::random(5);

                    // Verifica que el código sea único
                    while (Product::where('product_code', $uniqueCode)->exists()) {
                        $uniqueCode = $baseCode . '-' . Str::random(5);
                    }

                    $product->product_code = $uniqueCode;
                }
            } catch (\Exception $e) {
                // Manejo de errores
                Log::error('Error creating product code: ' . $e->getMessage());
                throw $e;
            }
        });


    }

    public function generateFullProductCode()
    {
        $size = Size::find($this->size_id);
        $color = Color::find($this->color_id);

        if ($size && $color) {
            return $this->product_code . '-' . $size->code . '-' . $color->code;
        }

        return $this->product_code;
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'product_color');
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class, 'product_size');
    }

    public function imgs()
    {
        return $this->belongsToMany(Img::class, 'img_products', 'product_id', 'img_id');
    }

    public function warehouse()
    {
        return $this->hasMany(warehouses_products::class, 'product_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}

