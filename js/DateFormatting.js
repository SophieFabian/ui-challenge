Date.prototype.format = function(){
	var year = this.getFullYear();
	var month = this.getMonth()+1 > 9 ? this.getMonth()+1 : "0" + (this.getMonth()+1);
	var day = this.getDate() > 9 ? this.getDate() : "0" + this.getDate();
	var hour = this.getHours() > 9 ? this.getHours() : "0" + this.getHours();
	var minute = this.getMinutes() > 9 ? this.getMinutes() : "0" + this.getMinutes();

	return month+"/"+day+"/"+year+" "+hour+":"+minute;
};
