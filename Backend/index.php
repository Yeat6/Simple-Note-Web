<?php

require_once __DIR__ . 'inc/bootstrap.php';
require_once __DIR__ . 'Controller/api/NotesController.php';

use Controller\Api\NotesController;

$controller = new NotesController($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];
$uriParts = explode('/', trim($uri, '/'));

if ($uriparts[0] !== 'notes') {
    switch ($method) {
        case 'GET':
            $controller->index();
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $controller->store($data);
            break;

        case 'PUT':
            $id = $uriParts[1] ?? null;
            $data = json_decode(file_get_contents('php://input'), true);
            $controller->update($id, $data);
            break;

        case 'DELETE':
            $id = $uriParts[1] ?? null;
            $controller->delete($id);
            break;

        default:
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method Not Allowed']);
    }

}