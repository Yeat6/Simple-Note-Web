<?php
namespace Controller\Api;

require_once __DIR__ . '/BaseController.php';

class NotesController extends BaseController
{
    private $pdo;
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    //GET /notes
    public function index()
    {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM notes");
            $stmt->execute();
            $notes = $stmt->fetchAll(\PDO::FETCH_ASSOC);

            if (empty($notes)) {
                $this->response(["debug" => "Query jalan, tapi tabel kosong"]);
            } else {
                $this->response($notes);
            }
        } catch (\PDOException $e) {
            $this->response(["error" => $e->getMessage()]);
        }
    }

    //POST /notes
    public function store($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO notes (title, note_content, created_at) VALUES (:title, :note_content, NOW())");
        $stmt->execute([
            ':title' => $data['title'],
            ':note_content' => $data['note_content']
        ]);
        $this->response(['message' => 'Note created succesfully'], 201);
    }

    //PUT /notes/{id}
    public function update($id, $data)
    {
        $stmt = $this->pdo->prepare("UPDATE notes SET title = :title, note_content = :note_content WHERE id = :id");
        $stmt->execute([
            ':title' => $data['title'],
            ':note_content' => $data['note_content'],
            ':id' => $id
        ]);
        $this->response(['message' => 'Note updated succesfully']);
    }

    //DELETE /notes/{id}
    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM notes WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $this->response(['message' => 'Note deleted succesfully']);
    }

}