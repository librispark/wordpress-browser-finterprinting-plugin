# wordpress-browser-finterprinting-plugin

Abstract

Determining the identity of a user is an important aspect that many organizations developing on the internet must consider incorporating into their products, both to authenticate users and to establish a profile in order to better understand their consumers.  Currently, advanced cryptographic authentication has been developed and iterated upon by many innovators across the world, but these techniques require the user to identify themselves directly, creating a burden on the user and requiring them to allow foreign services to operate on their computers.  In addition, with the recent rise in privacy consciousness, more and more users are taking simple yet previously effective measures--primarily clearing cookies--to remain anonymous on the internet.  However, with the advent of browser fingerprinting, industry is no longer limited to utilizing cookies to identify and track a user.  Information regarding this protocol is in high demand, but much remains proprietary and unavailable to the public.  We seek to provide a research tool capable of capturing enough material for interested parties to investigate and integrate into their own inventions.

In this document, we discuss techniques for noninvasively determining the identity of a user through a unique browser fingerprint extracted from the characteristics of a user’s browser.  We present a system which has been designed to create fingerprints and test the viability of browser fingerprinting as a non-cryptographically secure, but non-invasive, means of user identification.  The software package included assembles the fingerprints of users and performs analyses essential for such a test, and provides a means of integrating browser fingerprinting into an existing product.   A validation study performed using this package exhibits its capabilities and effectiveness in browser fingerprinting experimentation.

I.  Introduction

Our product is a browser fingerprinting system designed for research purposes. Included in our package are the module for gathering browser fingerprints, a plugin that allows for our browser fingerprinting module to identify a control group user, a database backend to handle communication and store any data collected, a WordPress plugin to use the tool, and lastly, several sample methods of polling our database to gather data for analyses. Our product is intended to be installed and run on a webpage as a non-intrusive method of collecting browser fingerprints of visiting users. In addition, researchers may utilize the provided browser plugin to select and identify control group users to fulfill the needs of any scientific research experiment.
 
The content of this document is organized into five major sections, beginning with section II; “Project Completion”, “Project Validation”, “Cost”, “Sample Study as Final Validation Exercise”, and “Conclusion”. 

In section II, “Project Completion”, we include a description of the features originally proposed for our product, the features delivered, specifications unique to our browser fingerprinting process, details regarding our abstract approach in our implementation, and a file manifest listing the files that compose our product. Section III explains the procedure and results of the individual validation exercises for each component of our system, as outlined in the Project Proposal [1]. Section IV details our final validation study, providing strong evidence that our package includes all the necessary elements to conduct a successful research experiment and permits our clients the ability to draw conclusions through the analysis of data. Section V is our cost analysis, where we note our predicted work hours, compare them to the actual work hours, and explain the differences between the two. Finally, the Conclusion (Section VI) reiterates our results, and elaborates on the success, failure, and future of the project.

II. Project Completion

The project has been implemented as promised for hosting on Debian servers running Apache. The version delivered in the https://vis.cs.umd.edu/svn/projects/goldfinger/ svn repository is version 1.0.0, as promised. To provide evidence of the comprehensive completion of the project, we will compare the product components as proposed at the project’s start to the product’s final features. 


II. a. Promised Product Features

The following features were described in the Project Proposal [1].
1.	Website toolkit for collection of browser fingerprints
2.	MongoDB Database, NodeJS backend
3.	Data analysis tools/scripts - to serve as examples of possible scripts
a.	Providing the number (and percentage) of unique fingerprints among all fingerprints
b.	Filtering based on number of stored fingerprints per user
c.	Filtering fingerprints based on latitude and longitude
d.	Filtering of users based on given browser configurations
e.	Identify anomalies in a set of user’s fingerprints such as
i.	irregular timestamp
ii.	irregular geolocation
4.	Control group browser plugin for all major browsers
a.	Supported browsers
i.	Google Chrome
ii.	Opera
iii.	Safari
iv.	Internet Explorer
v.	Firefox
5.	WordPress plugin as an example application of the tool
6.	Capability for the product to function as a standalone application on a single server
7.	Capability for the product to function as a Multiple Application Server, Single Database Architecture

II. b. Implemented Product Features

The following features are present in the final product:
1.	Website toolkit for collection of browser fingerprints
a.	Hosted on: 	viable.cs.umd.edu
b.	and: 		volition.cs.umd.edu
2.	MongoDB Database, NodeJS backend.
a.	Hosted on:	volition.cs.umd.edu
3.	Data analysis tools/scripts - to serve as examples of possible scripts
a.	Providing the number (and percentage) of unique fingerprints among all fingerprints
b.	Filtering database contents by fingerprint values
c.	Sort database contents by fingerprint attribute
d.	Identify anomalies in a set of user’s fingerprints such as
i.	irregular timestamp
ii.	irregular geolocation
4.	Cross platform control group browser extension for all major browsers
a.	Download at: 	http://crossrider.com/download/74704
5.	WordPress plugin as an example application of the tool
a.	Example site hosted at: 	viable.cs.umd.edu/wordpress/wp-login.php
6.	Capability for the product to function as a standalone application on a single server
a.	Functions as a standalone application on viable.cs.umd.edu
7.	Capability for the product to function as a Multiple Application Server, Single Database Architecture
a.	The applications hosted on viable.cs.umd.edu and volition.cs.umd.edu both communicate with the MongoDB/NodeJS backend on volition.cs.umd.edu

II. c. Product Component Details

The features listed above (Section II. b.) are implemented as part of this project’s final product. The website toolkit consists of a JavaScript file (as promised) that collects fingerprints and sends these fingerprints to the database backend. The backend consists of a Mongo database using JavaScript (NodeJS) for server-client communication. Also included are a collection of analysis scripts (JavaScript) that can be used to analyze the data present in the database. 

In order to run an experiment without requiring users to log-in, we developed a browser plugin intended to be installed on control group member’s browsers. The extension provides each user with a unique ID to allow researchers to identify each user within the control group for greater jurisdiction over the management of the group . Username, extracted from the use our JavaScript toolkit, or control ID, extracted from provided browser extension, are associated with fingerprints before the data is sent to the database. In our WordPress example, usernames are extracted using our Wordpress plugin contained on the page. The plugin encapsulates our entire JavaScript fingerprinting toolkit and includes a PHP file that triggers the toolkit to run when a user logs in, sending that username to the database along with their fingerprint.

In order to anticipate the potential needs of researchers, we have designed our product to work with multiple server configurations. Whether an experiment is run across multiple servers or solely on one server, our tool is capable of consolidating all collected data in a single database in real time. Figures 1 and 2 (below) show the designs from our proposal [1] with the host server names that were used when implementing the design.
 
 





II. d. Proposed Product versus Implementation

The lists in Sections II. a. and II. b. present the features that were promised and provided, organized successive outlines. These two outlines are largely equivalent; the second one providing slightly more information regarding the servers used to host the product components during verification and validation exercises. The following table is another view of each proposed feature and its completion status to emphasize that we delivered what we promised:

Table 1: Completion of Promised Features/Components
Feature from proposal (Listed in Section II. a)	Completion State of Feature
1.	Fingerprinting toolkit	Complete
2. MongoDB Database, NodeJS backend	Complete
3. Analysis scripts	Complete - filename differences (11.d.1)
4. Cross-platform control group plugins	Complete
5. WordPress plugin	Complete
6. Standalone server implementation	Complete
7. Multiple server implementation	Complete

The delivered website toolkit, backend components, control group plugin, WordPress plugin, and server configuration options match their respective proposed counterparts. The remaining component (item 3: analysis scripts) contains slight differences relating to filename and packaging, but still implements all proposed functionality.

II. d. 1. More Detailed File Manifest and Explanation

As mentioned before, these differences are not functionality differences, but deliverable/packaging differences. The File Manifest in Section 3.1.1 of the Project Proposal [1] includes the following analysis script files: analysis_unique.sh, analysis_num_fingerprints.sh, analysis_location.sh, analysis_browsers.sh, anomaly_time.sh, and anomaly_location.sh. It was discovered that “.sh” files (bash scripts) would not make sense to use when interacting with a Mongo database. Therefore, NodeJS JavaScript files contain the scripts instead. Additionally, some of the analysis files listed in the proposal were actually combined into a single script. These differences are explained in Table 2 below.

Table 2.
File from Project Proposal	Corresponding Delivered File
analysis_unique.sh	GetUniqueness.js
analysis_num_fingerprints.sh, analysis_location.sh, analysis_browsers.sh	FilterByValue.js,
SortByAttribute.js
anomaly_time.sh, anomaly_location.sh	AnomalyDetection.js

As requested by the client, the file manifest in the proposal only lists the major project files. During development, it became apparent that organizing files into subdirectories was necessary to keep the project components modularized and organized. Therefore, within the promised browserfingerprinting_deliverables directory, there are separate directories for General Application, Analysis Scripts, Control_Plugin_Files, and WordPress. In addition to the README file in the main directory, there are README files in certain subdirectories for more specific instructions or details about those components of the application. The install.sh file mentioned in the proposal is present, and is used in conjunction with a config.sh (toolkit_config.sh for WordPress) file that prompts users for the name of the servers they would like to use as the application servers and database server.

The WordPress plugin includes a goldfingerprinting.php file that is very brief and simply triggers the toolkit to run. The control group plugin does include the promised Control_Group_Recruiting.txt file, along with two JavaScript source files: background.js and extension.js. These were used along with the tool called crossrider to develop the control group plugin/extension, but serve no other purpose. We have included them in case our clients wish to host the plugin on their own servers, rather than linking users to the crossrider download page.

Our JavaScript toolkit requires a NodeJS JavaScript file for interfacing with the Mongo database. To address this need, our NodeJS implementation is contained in the backend.js file in the General Application directory. We have also provided copies of backend.js and fingerprint_toolkit.js files ending with “_master.js” that should only be used when running controlled experiments, as they present security complications; they provide browser-side capability to view or clear database contents, and therefore should only be used when the potential users are all confirmed to be trustworthy (ie. the researchers/developers themselves). 

Class project credits to (below), ported from svn repository.
David Banks, Evan Fischell, Jeremy Feldman, Joseph Brosnihan, Koji Lopez, Mitchell Tracy, Richard Lou
