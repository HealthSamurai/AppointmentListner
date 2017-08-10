var http = require('http')
  , request = require('request')
  , base = process.env.BASE_URL || "http://hackathon.dev.aidbox.io";

var hl7 = function(appointment) {
    var fo = "bar"
    console.log(`
MSH|^~\&|Family Health CEO App|Family Health|Family Health CEO App|Family Health|${appointment.created}||SIU^S12|60235|T|2.3|||||||||||
SCH|${appointment.id}|${appointment.id}||||BOOKED|${appointment.reason.text}|${appointment.appointmentType.coding[0].display}|${appointment.minutesDuration}|MIN|^^^${appointment.start}|BARLLH1^BARLOW^LOUIS^H.||GREECE VITAEHR PATIENT BUSINESS^SR HEALTHCARE DATA ANALYST VITAEHR||BARLLH1^BARLOW^LOUIS^H.|||| BARLLH1^BARLOW^LOUIS^H.|||||BOOKED||
PID|1||1364958346^^^VITAEHRMRN^||${appointment.participant[0].actor.display}||19490512|M||<Race>|876 HILL^^BANANA VALLEY^TN^37012^US^^^ALEXANDRIA|ALEXANDRIA|(299)778-5327^^H^^^299^7785327||<Primary Language>|<Marital Status>|||<SSN 282-15-8775>|||||||||||N||
PV1||O|NGDC SLEEP MED LAB^^^810^^^^^^^|||||||||||||||||||||||||||||||||||||||||||||||
RGS|1||8223374^NGDC SLEEP MED LAB
AIL|1||${appointment.participant[3].actor.display}|<Location Type>|||||||||
NTE|1||${appointment.comment}|
AIS|1||${appointment.serviceType[0].coding[0].system}^${appointment.serviceType[0].coding[0].code}^${appointment.serviceType[0].coding[0].display}|${appointment.start}|||${appointment.minutesDuration}|MIN||BOOKED||
AIP|1||${appointment.participant[1].actor.display} |${appointment.participant[1].type[0].text}||<Start Date/Time>20170806123654|0|MIN|${appointment.minutesDuration}|MIN
AIP|2||${appointment.participant[2].type[0].text} |${appointment.participant[2].actor.display}||<Start Date/Time>20170806123654|0|MIN|${appointment.minutesDuration}|MIN
`)
    //console.log(appointment);
};

var update = function(appointment){
    appointment.status = 'booked';
    request({
        url: base + "/fhir/Appointment/" + appointment.id,
        method: "PUT",
        json: appointment
    });
};

var processAppointment = function(appointments){
    appointments.entry.map(function(a) {
            return a.resource;})
        .map(function(a) {
            hl7(a);
            return a;})
        .map( update );
};

var poll = function(){
    http.get(base + "/fhir/Appointment?_count=1",  (res) => {
        var body = '';
        res.on('data', function(chunk){
            body += chunk;});
        res.on('end', function(){
            processAppointment(JSON.parse(body));
        });
    });
};

poll();

//setInterval(poll,  2000);






