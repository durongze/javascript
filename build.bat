rem xcopy lib\node-x64 %HOMEPATH%\.cmake-js\node-x64 /y /e /i /q
call "C:\Program Files (x86)\Microsoft Visual Studio 14.0\VC\bin\vcvars32.bat"
cmake-js -G "Visual Studio 14 2015 Win64"