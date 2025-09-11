<?php

namespace Controller\Api;

class BaseController
{
    protected function response($data, $status = 200)
    {
        http_response_code($status);
        header('content-type: application/json');
    }
}