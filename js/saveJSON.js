function saveJSON(){
    var masObject=[];   //массив объектов
    var masJoint=[];    //массив в котором будут храниться соединения

    //записываем в masObject
    for(var currentBody = world.GetBodyList(); currentBody; currentBody = currentBody.GetNext()){

        var obj = getSimpleObject(currentBody);
        masObject.push(obj);   //записываем объекты в массив, причем необходимо последних 5 удалить!!!
        console.log(obj);

    }

    //записываем в masJoint
    for(var currentJoint = world.GetJointList(); currentJoint; currentJoint = currentJoint.GetNext()){

        var joint = getJoint(currentJoint);
        masJoint.push(joint);   //записываем объекты в массив, причем необходимо последних 5 удалить!!!
        console.log(joint);

    }


    //удаляем лишние объекты, т.е лишними являются объект мира, граница
    for(var i = 0; i < 5; i++){
      masObject.pop();
    }
    //записываем в строку
    var strObjects = JSON.stringify(masObject);
    var strJoint = JSON.stringify(masJoint);

    //записываем в файл
    var request = getXmlHttpRequest();	 // получаем объект XMLHttpRequest (AJAX)

    request.onreadystatechange = function (){		// onreadystatechange - обработчик изменения состояния данного объекта

        /*свойство readyState - состояние объекта
         0 — не инициализирован
         1 — открыт,
         2 — отправка данных,
         3 — получение данных,
         4 — данные загружены
         рекомендую использовать только 4*/
        if (request.readyState == 4) {	// данные загружены
            if (request.status == 200){	// свойство status это HTTP-статус ответа: 200-OK, 404-Not Found
                alert("Сохранили");
            }
            else
                document.write("Произошла ошибка. Обновите страницу.");
        }
    }

    var url = "/php/save.php";				// ## адрес серверного скрипта
    var data = "strObjects="+strObjects + "&strJoints=" + strJoint;	    // задаем параметры

    // запрос на сервер, true означает что это асинхронный запрос (не ждем ответ)
    // если было бы false то это синхронный запрос
    request.open("POST", url, true);
    //request.setRequestHeader("Content-type", "charset=windows-1251");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   // request.setRequestHeader("Content-Length", data.length);
    request.send(data); // посыл данных, вместо null вставляем переменную с параметрами

}

function getSimpleObject(body){
    var obj = {};

    obj["type"] = body.GetType();                       //динамическое, статическое или ... тело
    obj["angle"] = body.GetAngle();

    obj["x"] = body.GetPosition().x;
    obj["y"] = body.GetPosition().y;

    obj["angleVelocity"] = body.GetAngularVelocity();   //угловая скорость
    obj["mass"] = body.GetMass();                      //масса

    if (body.GetFixtureList()){

        obj["density"] = body.GetFixtureList().GetDensity();          // плотность
        obj["friction"] = body.GetFixtureList().GetFriction();        // трение
        obj["restitution"] = body.GetFixtureList().GetRestitution();  // упругость

        obj["shape"] = body.GetFixtureList().GetShape().GetType();              // получить форму тела
        obj["isSensor"] = body.GetFixtureList().IsSensor();           // no-solid???
        obj["sizeX"] = body.GetFixtureList().GetAABB().GetExtents().x;
        obj["sizeY"] = body.GetFixtureList().GetAABB().GetExtents().y;
    }

    return obj;
}

function getJoint(joint){
    var obj = {};

    var firstObj = joint.GetBodyA();
    var secondObj = joint.GetBodyB();

    var i = 0 ;

    for(var currentBody = world.GetBodyList(); currentBody; currentBody = currentBody.GetNext()){
      if (currentBody == firstObj){
          obj["firstObject"] = i;           // первый объект соединения index из masObject[]
      }
      if (currentBody == secondObj){
          obj["secondObject"] = i;          // второй объект соединения index из masObject[]
      }
        i++;

    }

    obj["type"] = joint.GetType();               // тип соединения type Joint c помощью которого соединены  2 объекта

    obj["firstPointX"] = joint.GetAnchorA().x;     // точка соединения с первым телом X
    obj["firstPointY"] = joint.GetAnchorA().y;     // точка соединения с первым телом Y
    obj["secondPointX"] = joint.GetAnchorB().x;    // точка соединения с вторым телом X
    obj["secondPointY"] = joint.GetAnchorB().y;    // точка соединения с вторым телом Y

    return obj;
}

function getXmlHttpRequest(){	//функция создания объекта XMLHttpRequest
    if (window.XMLHttpRequest){
        try{
            return new XMLHttpRequest();
        }
        catch (e){}
    }
    else if (window.ActiveXObject){
        try{
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e){}
        try{
            return new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (e){}
    }
    return null;
}
