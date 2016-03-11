jsgui library
=============

JavaScript Graphical User Interface Library v0.5.0.

# Core Features

## Core language objects and utilities

-   Data Structures (such as B+ tree)
-   General purpose JavaScript functions such as .clone and .call_multi
-   Object Oriented Class system based on John Resig's work but extended
-   Ability to create 'Abstract' versions of a Class. This is done by omitting the 'new' keyword when using the constructor. For example, you may have a Database_Connection module, which in Abstract mode represents the parameters for a database connection rather than the functional database connection.
-   Data_Value (MVC for types such as number as string)
-   Data_Object (analogous to Backbone's Model)
-   Collection
-   Indexing that makes use of a simple dictionary or a B+ tree to index items in a Collection (in other words the core of some in-memory database functionality)
-   Event handling is baked into Evented_Class, which many other jsgui classes inherit from indirectly.
-   I use underscores rather than camel case all over the place. I find it more readable.

## HTML Processing:

-   Control - this was first intended to be somewhat like ASP.NET and Windows Forms User Controls but is somewhat like a Backbone View. Jsgui Controls can be rendered on either the client or the server, and get rendered as they should appear at first by the server, then get activated on the client. So in that way it's a bit like MeteorJS but it's on the standard node.js runtime. Controls inherits from Data_Object.

-   HTML Basic Controls - Control defaults to a div but there is syntax that makes it quick to make other elements as JSGUI controls.
-   Advanced Controls - A variety of Controls that do a bunch of different things in various stages of completeness, eg Horizontal_Slider. Some are not really that advanced but they are built on top of functionality that's basic so I'm sticking with that name for the moment.


## Server:

-   Responds to HTTP requests, providing HTML rendering of Controls, which then can be activated on the client-side. Uses the Resource system for a variety of things, such as Authentication and Authorization.
-   Resources system - An abstraction that aims to enable (almost) any computing resource to be exposed over HTTP. Coding something as a Resource is also useful when it's providing asynchronous responses by removing confusion about whether or not a function has an async API - if you are calling 'get' or 'set' on a Resource, it's an async call. So far I'm using Resources within the web server, which will aid in configurability, but a lot of care will need to be taken to make sure it's secure.
-   Image processing - Pixel_Buffer, PNG and JPEG compression and decompression, written for the server. Some code uses C++ called from node.
-   Sprite Sheet Assembler
-   Abstractions for representing databases in detail
-   Unfinished ORM system which already has got some significant Postgres-specific capabilities.

# Future Plans (there are beginnings of some of these in the code and references to them)

-   (A bit like Angular and ASP.NET) Representing Controls within HTML (or HTML-like) documents that get rendered on the server. This is quite a bit like ASP.NET but the same syntax will also be usable client-side to render Controls.
-   CMS and Web Server Configuration Application (eventually with integrated cross-platform ORM tools)
-   Using the server to host documentation, examples and discussion
-   Camel Case API
-   Many improvements all round. Suggestions welcome.

# License

Licensed under the MIT License.
