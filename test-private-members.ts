class TestClass {
	// These should be detected by enhanced no-unused-vars rule
	private unusedPrivateProperty = 'never used';
	private alsoUnused = 'also never used';

	// This private method should be detected
	private unusedPrivateMethod() {
		return 'this is never called';
	}

	// This private method should also be detected
	private anotherUnusedMethod(param: string) {
		console.log(param);
		return param;
	}

	// These should be fine (used)
	private usedProperty = 'used value';
	private usedPrivateMethod() {
		return this.usedProperty;
	}

	public useMembers() {
		return this.usedPrivateMethod();
	}
}