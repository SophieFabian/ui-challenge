Date.prototype.format = function(){
	return (this.getMonth()+1)+"/"
			+this.getDay()+"/"
			+this.getFullYear()+" "
			+this.getHours()+":"
			+this.getMinutes()
}
