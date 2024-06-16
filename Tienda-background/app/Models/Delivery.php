<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'arrival_id',
        'warehouse_id',
        'departure',
        'departure_time',
        'arrival_time'
    ];


    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function arrival()
    {
        return $this->belongsTo(Arrival::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }
}
