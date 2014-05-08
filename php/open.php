<?
    $file = fopen("../experiments/1.txt","rt") or die;

    echo fgets($file);

    fclose($file);
?>