<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    use HasFactory;

    public function categoria()
    {
        return $this->belongsTo(Category::class, 'parent_category_id', 'id');
    }

}
