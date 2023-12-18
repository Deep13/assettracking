<?php
// Establish your database connection here
// Replace placeholders with your actual database credentials

// $servername = "localhost:8080";
// $username = "root";
// $password = "";
// $dbname = "assetTracking";

// // Create connection
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Check connection
// if ($conn->connect_error) {
//     die("Connection failed: " . $conn->connect_error);
// }

// // Retrieve POST data
// $data = json_decode(file_get_contents('php://input'), true);
// $username = $data['username'];
// $password = $data['pwd'];

// // Hash the password before storing it in the database
// $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// // Prepare a statement to check if the username already exists
// $stmt = $conn->prepare("SELECT username FROM profiles WHERE username = ?");
// $stmt->bind_param("s", $username);
// $stmt->execute();
// $result = $stmt->get_result();

// if ($result->num_rows > 0) {
//     // Username already exists
//     $response = array('success' => false, 'message' => 'Username already exists');
// } else {
//     // Insert the new user into the database
//     $stmt = $conn->prepare("INSERT INTO profiles (username, pwd) VALUES (?, ?)");
//     $stmt->bind_param("ss", $username, $hashedPassword);
//     $stmt->execute();

//     $response = array('success' => true);
// }

// $stmt->close();
// $conn->close();

// header('Content-Type: application/json');
// echo json_encode($response);


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



?>