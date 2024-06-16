<!DOCTYPE html>
<html>
<head>
    <title>Client Communication</title>
</head>
<body>
    <h1>Mensaje del Cliente</h1>
    <p><strong>Nombre:</strong> {{ $data['firstName'] }}</p>
    <p><strong>Apellido:</strong> {{ $data['lastName'] }}</p>
    <p><strong>Correo Electrónico:</strong> {{ $data['email'] }}</p>
    <p><strong>Teléfono:</strong> {{ $data['phone'] }}</p>
    <p><strong>Mensaje:</strong> {{ $data['message'] }}</p>
</body>
</html>
