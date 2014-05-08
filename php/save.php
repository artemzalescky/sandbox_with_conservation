<?
    $file = fopen("../experiments/1.txt","wt") or die;

    fputs($file,$_POST["strObjects"]);
    fputs($file,$_POST["strJoints"]);

    fclose($file);
?>