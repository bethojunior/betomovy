<?php

namespace app\utils;

abstract class AbstractValidationPersonalDocument
{
    protected $apiUrl;

    public abstract function __construct();

    public abstract function validate($document);
}