<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory;

    public function products()
    {
        return $this->hasMany(warehouses_products::class, 'warehouse_id');
    }
    public function delivery()
    {
        return $this->hasMany(Delivery::class);
    }
}
