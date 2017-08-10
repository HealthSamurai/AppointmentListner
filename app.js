var http = require('http')
  , request = require('request')
  , base = process.env.BASE_URL || "http://hackathon.dev.aidbox.io";

var hl7 = function(appointment) {
    var fo = "bar"
    console.log(`|Some|HL7|^for|${appointment.id}
|some|another|string`)
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
