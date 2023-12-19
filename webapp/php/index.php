<?php
header("Access-Control-Allow-Origin:*");
// header('Content-Type: application/json');
echo $_POST["method"]();

//get all labour name
function getAllusers(){
$servername = "localhost";
$username = "root";
$dbname = "assetTracking";
// Create connection
$conn = new mysqli($servername, $username,"", $dbname);
// Check connection
	if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
	}
// Perform query
if ($result = $conn->query("SELECT username,name FROM profiles")) {
    if ($result->num_rows > 0) {
        $dataArray = array(); // Initialize an array to hold the data
        $i = 0;
        while ($row = $result->fetch_assoc()) {
            $dataArray[$i] = $row;
            $i++;
        }
        header('Content-Type: application/json');
        echo json_encode($dataArray);
    } else {
        header('Content-Type: application/json');
        echo json_encode([]); // Empty array if no data found
    }
} else {
    // Handle query error
    header('Content-Type: application/json');
    echo json_encode(["error" => $conn->error]);
}
$conn->close();
}


function createUsers(){
    $servername = "localhost";
    $username = "root";
    $dbname = "assetTracking";
    // Create connection
    $conn = new mysqli($servername, $username,"", $dbname);
    // Check connection
        if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        }
        $obj = json_decode($_POST["data"]);
        $username = $obj->username;
        $name = $obj->name;
        $pwd = $obj->pwd;
        $hashedPassword = password_hash($pwd, PASSWORD_DEFAULT);
// Perform query
$sql ="INSERT INTO `profiles` (`id`, `name`, `username`, `pwd`) VALUES (NULL, '$name','$username','$hashedPassword')";
        if(mysqli_query($conn,$sql)){
        $dataArray[0] = 'Insertion successful';
        echo json_encode($dataArray);
        }
        else{
        $dataArray[0] = 'Insertion failed';
        echo json_encode($dataArray);
        }
    
    $conn->close();
    }

    function loginCheck(){
        $servername = "localhost";
        $username = "root";
        $dbname = "assetTracking";
        // Create connection
        $conn = new mysqli($servername, $username,"", $dbname);
        // Check connection
            if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
            }
            $obj = json_decode($_POST["data"]);
            $username = $obj->username;
            $pwd = $obj->pwd;
        // Perform query
        if ($result = $conn->query("SELECT name,username, pwd FROM profiles WHERE username = '$username'")) {
            if ($result->num_rows > 0) {
                $dataArray = array(); // Initialize an array to hold the data
                $i = 0;
                $row = $result->fetch_assoc();
                $hashedPassword = $row['pwd'];
                if (password_verify($pwd, $hashedPassword)) {
                    // Password is correct
                    $dataArray =array(
                        'username' => $row['username'],
                        'name' => $row['name']
                    );
                } else {
                    // Password is incorrect
                    $dataArray[0] = 'Login failed';
                }
                // while ($row = $result->fetch_assoc()) {
                //     $dataArray[$i] = $row;
                //     $i++;
                // }
                header('Content-Type: application/json');
                echo json_encode($dataArray);
            } else {
                header('Content-Type: application/json');
                echo json_encode(['Login unsuccesfull']); // Empty array if no data found
            }
        } else {
            // Handle query error
            header('Content-Type: application/json');
            echo json_encode(["error" => $conn->error]);
        }
        $conn->close();
        }

?>