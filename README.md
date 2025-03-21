![Alt text](./frontend/src/images/readme-guide/image.png)

# [NTU Shanfu Course Platform](https://ntushanfu-course.onrender.com/)

The NTU Shanfu Course Platform offers a unique space for Shanfu members to share and discover courses. Operating as a volunteer student club that organizes summer and winter camps for elementary school children, it is crucial for our members to create engaging and educational courses. The platform's ease of access to diverse course designs can foster creativity and inspiration, encouraging the exchange of ideas and learning from one another. This dynamic interaction is viewed as an essential element for the positive development of our club. 

## Motivation

The NTU Shanfu Course Platform addresses a key gap in our long-standing, 50-year-old student club. Despite an abundance of resources and a rich history of experience, members across different divisions (家別) have faced challenges in accessing and sharing courses due to traditional operational practices and limitations in software and hardware. Typically, members have only referenced curriculum papers within their own division, leading to missed opportunities for broader improvement and collaboration. Our goal is to develop this platform to optimize the use of these valuable resources and to encourage more members to share their own work, thereby enhancing the overall quality and reach of our educational initiatives.

## Features

### 1. Tour–A quick guide to this platform

On the home page of the NTU Shanfu Course Platform, visitors are greeted with an intuitive and user-friendly interface. Prominently featured is a 'Tour' button, designed to guide users through the platform's functionalities. Clicking on this button initiates an interactive tour, which is especially helpful for new users unfamiliar with the navigation bar and the platform's features.

![Alt text](./frontend/src/images/readme-guide/image-1.png)

### 2. Filter and browse through course cards 

On the NTU Shanfu Curricula Platform, accessing a wide range of member-designed courses is straightforward. By simply clicking on "所有教案" (All Courses) in the navigation bar, users can view all available courses. For those seeking specific subjects（科別）or divisions（家別）of courses, the platform offers convenient filtering options. By clicking the corresponding buttons, users can easily narrow down their search, resulting in a tailored display of courses that meet their specific interests and needs.

![Alt text](./frontend/src/images/readme-guide/image-2.png)

### 3. Search for keyword in curriculum papers

Users of the NTU Shanfu Curricula Platform have the ability to easily access a wide array of courses. By utilizing the search box on the navigation bar and entering relevant keywords, the platform dynamically displays courses that include these keywords in their curriculum papers. This powerful search functionality enables users to find specific courses not only based on basic information like course title, subject, and author, but also based on the content within the curriculum papers. This feature is particularly useful for members looking to determine if similar courses have been designed previously, ensuring a more informed and efficient course creation process.

![Alt text](./frontend/src/images/readme-guide/image-3.png)
![Alt text](./frontend/src/images/readme-guide/image-7.png)

### 4. View course detailed information

By clicking on a course card, the user is directed to a page displaying the complete content of the course. This includes a preview of the curriculum paper along with essential basic information such as the title, author, division, subject, and the teaching semester it is associated with. Additionally, for those who are signed in, there is an added convenience of being able to download the curriculum paper directly from the platform. This option is available through a download button located at the bottom-right of the page, allowing users to easily save and reference the material offline.

![Alt text](./frontend/src/images/readme-guide/image-4.png)

### 5. Register / Login / Logout

To register on the NTU Shanfu Curricula Platform, users are required to enter basic information such as their name, email, and password. Upon submitting the registration request, the platform ensures user security by encrypting the password before storing it in the database. Once the account is activated, users gain the ability to log in and utilize the platform's full range of features. This includes uploading their own curriculum papers and accessing a personal profile page where they can manage their contributions and settings. Additionally, for added convenience and security, the platform provides a logout option, enabling users to securely exit the platform after completing their activities.  

![Alt text](./frontend/src/images/readme-guide/image-5.png)
![Alt text](./frontend/src/images/readme-guide/image-8.png)

### 6. View and edit personal page

Once logged in, the user can reach to personal page. There are three sections, personal indormation, my courses and favorite courses. Uploading new profile picture and edit basic information of user are allowed through clicking the corresponding button. Each user's personal page displays a list of their uploaded courses. This feature enables users to easily manage and showcase their contributions, enhancing the collaborative and educational environment of the NTU Shanfu Curricula Platform.

![Alt text](./frontend/src/images/readme-guide/image-6.png)

### 7. Upload/Edit/Delete a course

Users on the NTU Shanfu Curricula Platform have the ability to contribute their own courses by creating a course card. This process begins by clicking the "上傳教案 Upload Courses" button, conveniently located on the right side of the navigation bar. Users are then guided through a straightforward process to fill in the required information for their course. Once a course is successfully uploaded, it becomes visible on the platform, accessible to other users for viewing. If a user wishes to modify or delete their course at any point, they can do so by clicking on "編輯教案基本資訊 Edit Basic Information". This option is available provided they are signed in and recognized as the author of the course.

![Alt text](./frontend/src/images/readme-guide/image-9.png)

## Dependencies / Resources
### Frontend
- User Interface / User Experience
  - [Ant Design](https://ant.design/)
  - Icons from [Flaticon](https://www.flaticon.com/)
  - [Google Fonts](https://fonts.google.com/)
- Web Services
  - [React](https://reactjs.org/)
  - [react-router-dom](https://v5.reactrouter.com/web/guides/quick-start)
- Utils
  - [React-pdf](https://react-pdf.org/) for PDF rendering in React applications
  - [sweetalert2](https://sweetalert2.github.io/) for creating beautiful, responsive alerts
  - [AWS SDK](https://www.npmjs.com/package/aws-sdk) for interacting with AWS services
### Backend
Only listing the main package:
- Web Framework
  - [Express](https://expressjs.com/) as a fast, unopinionated web framework for Node.js
- Database
  - [MySQL](https://www.mysql.com/) as a relational database management system
  - [AWS RDS](https://aws.amazon.com/pm/rds/?gclid=Cj0KCQiAnfmsBhDfARIsAM7MKi1MlEP-SFN4pKsLKFhkHEN8LqBzXcpGT1jPSJZN0Tzw1Mq9ssZ5rzsaAkhtEALw_wcB&trk=09de7cc5-b161-452b-97a1-c62551b62512&sc_channel=ps&ef_id=Cj0KCQiAnfmsBhDfARIsAM7MKi1MlEP-SFN4pKsLKFhkHEN8LqBzXcpGT1jPSJZN0Tzw1Mq9ssZ5rzsaAkhtEALw_wcB:G:s&s_kwcid=AL!4422!3!658520965805!!!g!!!19852661714!149878731020) for managed relational database service
- Utils
  - [Bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for implementing JWT authentication
  - [docxtemplater](https://www.npmjs.com/package/docxtemplater) for generating DOCX files
  - [AWS SDK](https://www.npmjs.com/package/aws-sdk) also listed here for using AWS services
- DevOps
  - [Render](https://render.com/) as a cloud service provider
  - [Docker](https://www.docker.com/) for containerization

## Link

- NTU Shanfu Curricula Platform Deployment Link: https://ntushanfu-course.onrender.com/
  - An account used for reviewer:
    - email: guest@ntushanfu.com
    - password: checkoutcourses

## Contirbutors

- [Chen-Syuan (Isabelle) Huang](https://github.com/Isabelle1007)  
  - email:
    - chensyuan.huang@gmail.com
  - phone: 
    - +1 314-296-8317 (USA)
    - +886 921-438-836 (Taiwan)
