function Steps (selector) {
    var section = document.getElementById(selector);
    this.stepSection = section;
    this.nav = section.querySelectorAll("input[name='steps']");
    this.stepContent = section.querySelectorAll(".step-content");
	return {
        nav : this.nav,
        content : this.stepContent
    };
}