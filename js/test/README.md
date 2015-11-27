For now the **test** directory consists of the following subdirectories:

- **test-utils** - test utility modules (not tests)
- **z_core** - jsgui core tests
- **z_heap** - some non-jsgui tests
- **z\_without\_jsgui** - some old non-jsgui tests (James authored)
- **z_zzz** - some old tests shelved for some reason
- **(all other)** - old tests more/less processed

The **z\_core** subdirectory is in working state, and all the tests must pass. Also **test-utils** and **z\_heap** is in working state too.

**To run some test file**, type the following command:
> mocha test-file-name

For example: run Data_Object.spec.js from current dir
> mocha Data_Object.spec.js

**To run all tests from a directory**, type the following command:
> mocha directory-name

For example: run all the test from current dir (notice the ending dot character meaning current dir)
> mocha .

**To run all tests from a directory including subdirectories**, type the following command:
> mocha --recursive directory-name

For example: run all the test from current dir and subdirs
> mocha --recursive .

