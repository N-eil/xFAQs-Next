<?php
	require 'simple_html_dom.php';
	header("Access-Control-Allow-Origin: http://www.gamefaqs.com ");
	header("Access-Control-Allow-Origin: * ");

	if ($_POST) {

		try {

			#throw new Exception('No longer supported');

			$user = str_replace(" ", "+", substr($_POST['user'], 0, -1));

			if (!empty($_SERVER['HTTP_CLIENT_IP']))
			{
				$ip = $_SERVER['HTTP_CLIENT_IP'];
			}
			elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))
			{
				$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			}
			else
			{
				$ip = $_SERVER['REMOTE_ADDR'];
			}

			$html = file_get_html('http://www.gamefaqs.com/users/'.$user.'/boards');

			foreach($html->find('td') as $element) {

				if($element->innertext == 'avatarupload:true') {

					// Rename uploaded file to reflect original name
					if ($_FILES['file']['error'] !== UPLOAD_ERR_OK)
						throw new Exception('File was not successfully uploaded from your computer.');

					if ($_FILES['file']['name'] === "")
						throw new Exception('File name not supplied by the browser.');

					$image_size = getimagesize( $_FILES['file']['tmp_name'] );

					if( $image_size[0] > 100 || $image_size[1] > 100 )
						throw new Exception('Image is too large, Maximum Dimensions: 100x100px');

					$file_name = substr($_POST['user'], 0, -1).'.png';

					if(file_exists("avatars/$file_name")) {
						if(fileperms("avatars/$file_name") == 33216 ) {
							throw new Exception('Please come here for help http://www.gamefaqs.com/boards/565885-blood-money/ and describe what you did to cause this error.');
						}
					}

					if (!move_uploaded_file($_FILES['file']['tmp_name'], "avatars/$file_name"))
						throw new Exception('Cannot rename uploaded file!');

					http_response_code(200);
					echo 'Upload Successful! Refreshing to apply changes...';
					return;
				}
			}

			echo "Please update to at least v2.1.0 of xfaqs or 2.6.0 of GameFAQs-Avatars";

		} catch(Exception $e) {
			http_response_code(400);
			echo 'Error: ' . htmlspecialchars($e->getMessage()) ;
		}
	}
?>