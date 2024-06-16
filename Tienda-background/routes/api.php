<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArrivalController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ImgController;
use App\Http\Controllers\ImgProductController;
use App\Http\Controllers\PhoneNumberController;
use App\Http\Controllers\PrefixController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PromoProductsController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WarehouseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\PayPalController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/create-order', [PayPalController::class, 'createOrder']);
Route::post('/capture-order', [PayPalController::class, 'captureOrder']);



Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::apiResource('/phone_number', PhoneNumberController::class);


});
Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function(Request $request){
        return $request->user();
    });

    Route::post('/verifyEmail', [EmailController::class, 'verifyEmail']);
    Route::post('/code', [EmailController::class, 'code']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user/info', [UserController::class, 'getUserInfo']);
    // Ruta para obtener las entregas de un pedido específico
    Route::get('/orders/{orderId}/deliveries', [OrderController::class, 'deliveries']);
    // Ruta para obtener los pedidos y entregas del usuario autenticado
    Route::get('/user/orders', [OrderController::class, 'getUserOrders']);
    Route::put('/user/{id}', [UserController::class, 'update']);
    Route::put('/user/{id}/password', [UserController::class, 'updatePassword']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);

    // Almacenar ordenes
    Route::post('/orders', [OrderController::class, 'store']);
});


Route::post('/insertComments', [CommentController::class, 'store']);
Route::get('/comments/{product_id}', [CommentController::class, 'getCommentsByProduct']);




//search
Route::post('/productSearch', [ProductController::class, 'searchCount']);
// Rutas de registro que requieren verificación de correo
    Route::post('/register', [AuthController::class, 'register']);

Route::get('/products', [ProductController::class, 'index']);
Route::post('/products/filter', [ProductController::class, 'filter']);
Route::get('/products/{product_code}/sizes-colors', [ProductController::class, 'getSizesAndColors']);
Route::get('/products/{productCode}/sizes-colors-filter', [ProductController::class, 'getProductsByCode']);


Route::apiResource('/promo', PromotionController::class);
Route::apiResource('/promoProduct', PromoProductsController::class);
Route::apiResource('/img', ImgController::class);
Route::apiResource('/imgProduct', ImgProductController::class);


Route::apiResource('/subcategories', SubCategoryController::class);

Route::apiResource('/prefixes', PrefixController::class);
Route::apiResource('/categories', CategoryController::class);
Route::apiResource('/warehouses', WarehouseController::class);
Route::apiResource('/arrivals', ArrivalController::class);
//Autentificacion
Route::post('/login',[AuthController::class, 'login']);


//CRUD
Route::post('/saveImage',[ImageController::class, 'saveImage']);
Route::post('/insertProduct',[AdminController::class, 'insertProduct']);
Route::post('/deleteProduct',[AdminController::class, 'deleteProduct']);
Route::post('/updateProduct',[AdminController::class, 'updateProduct']);
Route::post('/insertPromotion',[AdminController::class, 'insertPromotion']);
Route::post('/promoProducts', [AdminController::class, 'promoProducts']);
Route::post('/updateUser', [AdminController::class, 'updateUser']);
Route::get('/ordersRelease', [OrderController::class, 'index']);


Route::post('/deleteUser',[AdminController::class, 'deleteUser']);

//Email
Route::post('/send-mail', [EmailController::class, 'email']);
Route::post('/contact-us', [EmailController::class, 'emailClient']);
// Route::post('/verification', [EmailVerificationController::class, 'verifyEmail'])->name('verification');
