function skillsmembers() {
    var skills = document.getElementById("skills").value;
    var members = document.getElementById("members").value;
    var skills = skills.split(",");
    var members = members.split(",");
    var result = [];
    for (var i = 0; i < skills.length; i++) {
        for (var j = 0; j < members.length; j++) {
            if (skills[i] == members[j]) {
                result.push(skills[i]);
            }
        }
    }
    document.getElementById("result").innerHTML = result;
}
