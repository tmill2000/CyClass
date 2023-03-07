/**
 * AUTHOR:	Adam Walters
 * CREATED:	03/06/2023
 * UPDATED:	03/06/2023
 */

function pmod(x, y) {
	return ((x % y) + y) % y;
}

/**
 * Returns a time string that's relative to Date.now() in a standard format.
 * @return {string}
 */
Date.prototype.toRelativeString = function() {

	// Get elapsed seconds
	const elapsed = (Date.now() - this.getTime()) / 1000;

	// Return relative text
	if (elapsed < 60) {
		return "now";
	} else if (elapsed < 3600) {
		return Math.floor(elapsed / 60) + "m ago";
	} else if (elapsed < 86400) {
		return Math.floor(elapsed / 3600) + "h ago";
	} else {
		const timeStr = `${pmod(this.getHours() - 1, 12) + 1}:${this.getMinutes().toString().padStart(2, "0")}${(this.getHours() < 12) ? "am" : "pm"}`;
		if (elapsed < 86400 * 2) {
			return timeStr + " • yesterday";
		} else {
			const dateStr = `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear().toString().slice(2)}`;
			return timeStr + " • " + dateStr;
		}
	}

}