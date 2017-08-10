var http = require('http')
  , request = require('request')
  , base = process.env.BASE_URL || "http://hackathon.dev.aidbox.io";

var hl7 = function(appointment) {
    console.log(`
MSH|^~\&|Family Health CEO App|Family Health|Family Health CEO App|Family Health|${appointment.created}||SIU^S12|60235|T|2.3|||||||||||
SCH|${appointment.id}|${appointment.id}||||BOOKED|${appointment.reason.text}|${appointment.appointmentType.coding[0].display}|${appointment.minutesDuration}|MIN|^^^${appointment.start}|BARLLH1^BARLOW^LOUIS^H.||GREECE VITAEHR PATIENT BUSINESS^SR HEALTHCARE DATA ANALYST VITAEHR||BARLLH1^BARLOW^LOUIS^H.|||| BARLLH1^BARLOW^LOUIS^H.|||||BOOKED||
PID|1||${appointment.contained[0].id}^^^FamilyHealthCEOAppID^||${appointment.contained[0].name[0].family[0]}^${appointment.contained[0].name[0].given[0]}||${appointment.contained[0].birthDate}|${appointment.contained[0].gender}|||${appointment.contained[0].address[0].line[0]}^^${appointment.contained[0].address[0].city}^${appointment.contained[0].address[0].state}^${appointment.contained[0].address[0].postalCode}^US^^^${appointment.contained[0].address[0].district}|${appointment.contained[0].address[0].district}|${appointment.contained[0].telecom[0].value}^^H^^^||${appointment.contained[0].communication[0].language.coding[0].code}|${appointment.contained[0].maritalStatus.coding[0].code}|||${appointment.contained[0].identifier[0].value}|||||||||||N||
PV1||O|${appointment.contained[3].managingOrganization.display}^^^^^^^^^^|||||||||||||||||||||||||||||||||||||||||||||||
RGS|1||${appointment.contained[3].id}^${appointment.contained[3].managingOrganization.display}
AIL|1||${appointment.participant[3].actor.display}|${appointment.contained[3].type.coding[0].display}|||||||||
AIS|1||${appointment.serviceType[0].coding[0].system}^${appointment.serviceType[0].coding[0].code}^${appointment.serviceType[0].coding[0].display}|${appointment.start}|||${appointment.minutesDuration}|MIN||BOOKED||
NTE|1||${appointment.comment}|
AIP|1||${appointment.participant[1].actor.display} |${appointment.participant[1].type[0].text}||${appointment.start}|0|MIN|${appointment.minutesDuration}|MIN
AIP|2||${appointment.participant[2].actor.display}|${appointment.participant[2].type[0].text}||${appointment.start}|0|MIN|${appointment.minutesDuration}|MIN
`)
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
    http.get(base + "/fhir/Appointment?status=pending",  (res) => {
        var body = '';
        res.on('data', function(chunk){
            body += chunk;});
        res.on('end', function(){
            processAppointment(JSON.parse(body));
        });
    });
};

//poll();

setInterval(poll,  5000); 
