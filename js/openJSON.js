function openJSON(){
/*
var obj = {
    "angle": -0.33490047028261827,
    "angleVelocity": 0,
    "density": 0.5,
    "friction": 0.5,
    "isSensor": false,
    "mass": 11.583750245486346,
    "restitution": 0.3,
    "shape": 0,
    "sizeX": 2.715608027309715,
    "sizeY": 2.715592835406124,
    "type": 2,
    "x": 22.58611363275521,
    "y": 17.251073835830844
   };

    var obj2 = {
    "angle": -0.04084801909218573,
    "angleVelocity": 0,
    "density": 0.5,
    "friction": 0.5,
    "isSensor": false,
    "mass": 7.150613945420768,
    "restitution": 0.3,
    "shape": 0,
    "sizeX": 2.1336118124659986,
    "sizeY": 2.133593734127812,
    "type": 2,
    "x": 17.656958977882997,
    "y": 17.830751987645048
};

var joint = {
    "firstObject": 0,
    "firstPointX": 23.342634783532,
    "firstPointY": 16.686659817541425,
    "secondObject": 1,
    "secondPointX": 18.45369969652927,
    "secondPointY": 17.73466445258539,
    "type": 3
}
*/
    // открываем опыт
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
                var strObjects = request.responseText.split('][')[0] + ']';
                var strJoints = '[' + request.responseText.split('][')[1];

                createObjectsAndJoints(strObjects, strJoints);      // создаем всё
            }
            else
                document.write("Произошла ошибка. Обновите страницу.");
        }
    }

    var url = "/php/open.php";				// ## адрес серверного скрипта
    var data = "open_file=1";		// задаем параметры

    // запрос на сервер, true означает что это асинхронный запрос (не ждем ответ)
    // если было бы false то это синхронный запрос
    request.open("POST", url, true);
    //request.setRequestHeader("Content-type", "charset=windows-1251");
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //request.setRequestHeader("Content-Length", data.length);
    request.send(data); // посыл данных, вместо null вставляем переменную с параметрами


    function createObjectsAndJoints(strObjects, strJoints) {
        var masObjects = JSON.parse(strObjects);
        var masJoints = JSON.parse(strJoints);

        var realBodies = [];        // объекты box2d

        for (var i = 0; i < masObjects.length; i++) {
            realBodies.push(createObject(masObjects[i]));
        }

        for (var i = 0; i < masJoints.length; i++) {
            var pairOfBodies = [];
            pairOfBodies.push(realBodies[masJoints[i].firstObject]);    //1-й объект
            pairOfBodies.push(realBodies[masJoints[i].secondObject]);   //2-й объект

            var typeJoint = masJoints[i].type;                          //тип соединения

            var points = [new b2Vec2(masJoints[i].firstPointX, masJoints[i].firstPointY), new b2Vec2(masJoints[i].secondPointX, masJoints[i].secondPointY)];
            createJoint(pairOfBodies,points,typeJoint);
        }
    }

    function createObject(obj){
        var fixDef = new b2FixtureDef;
        fixDef.density = obj.density;                // плотность
        fixDef.friction = obj.friction;                // коэфициент трения
        fixDef.restitution = obj.restitution;        // коэффицент упругости
        fixDef.isSensor = obj.isSensor;             // если isSensor == False, тело твердое

        var bodyDef = new b2BodyDef;
        bodyDef.type = obj.type;                // тип тела (static, dynamic, kinematic)
        bodyDef.active = worldActivated;

        if (obj.shape == 0){ //создаём снаряд
          var points = [new b2Vec2(obj.x,obj.y), new b2Vec2(obj.x + obj.sizeX / Math.sqrt(2),obj.y + obj.sizeY / Math.sqrt(2))];
          return BallBuilder().build(points,fixDef,bodyDef);
        }
        else if (obj.shape == 1 ){ //создаем ящик
            var points = [new b2Vec2(obj.x - obj.sizeX,obj.y - obj.sizeY), new b2Vec2(obj.x + obj.sizeX,obj.y + obj.sizeY)];
            return BoxBuilder().build(points,fixDef,bodyDef)
        }

    }

    function createJoint(bodies,points,typeJoint){

        switch (typeJoint){     //3-Distance, 1 - revolute, 2- prismatic 6- Gear 4-Pulley
            case 1:
                return RevoluteJointBuilder().createJoint(bodies,points);
                break;
            case 2:
                return PrismaticJointBuilder().createJoint(bodies,points);
                break;
            case 3:
                return DistanceJointBuilder().createJoint(bodies,points);
                break;
            case 4:
                return PulleyJointBuilder().createJoint(bodies,points);
                break;
            case 6:
                return GearJointBuilder().createJoint(bodies,points);
                break;
            default:
                break;
        }

    }

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