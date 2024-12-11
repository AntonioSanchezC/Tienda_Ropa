<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura de Pedido</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #d1d5db;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 80%;
            max-width: 800px;
            margin: 40px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
        }
        .container::before {
            content: "";
            background-image: url("/imageBill/Tarjeta.png");
            background-size: cover;
            background-position: center;
            opacity: 0.1;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
            color: #2d3748;
        }

        table {
            width: 100%;
            border-collapse: separate;
            margin-bottom: 20px;
        }
        table th, table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        table th {
            background-color: #f9fafb;
            color: #1f2937;
        }

        .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 20px;
        }
        .total span {
            color: #f39c12;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Facturación del Pedido</h1>
        <table>
            <thead>
                <tr>
                    <th>Nombre del Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orderBill as $item)
                <tr>
                    <td>{{ $item['name'] }}</td>
                    <td>{{ $item['quantity'] }}</td>
                    <td>{{ $item['price'] }}€</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <p class="total">Precio Total: <span>{{ $orderBill[0]['price_total'] }} €</span></p>
        <p class="total">Código pedido: <span>{{ $orderBill[0]['code'] }}</span></p>
    </div>
</body>
</html>
