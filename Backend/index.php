<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/inc/bootstrap.php';
require_once __DIR__ . '/Controller/Api/NotesController.php';

use Controller\Api\NotesController;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// support either $pdo or $dbConnection from bootstrap
$pdo = $pdo ?? ($dbConnection ?? null);
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection not initialized']);
    exit();
}

$controller = new NotesController($pdo);

// parse path segments reliably
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = array_values(array_filter(explode('/', $path))); // removes empty entries

// find 'notes' segment
$notesIndex = array_search('notes', $segments, true);
if ($notesIndex === false) {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
    exit();
}

$id = $segments[$notesIndex + 1] ?? null;
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if ($id === null) {
            $controller->index();
        } else {
            // if you add show($id) later, call it here
            $controller->index(); // fallback to index for now
        }
        break;

    case 'POST':
        if (empty($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'No input data']);
            exit();
        }
        $controller->store($input);
        break;

    case 'PUT':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID for update']);
            exit();
        }
        $controller->update($id, $input ?? []);
        break;

    case 'DELETE':
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID for delete']);
            exit();
        }
        $controller->delete($id);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}