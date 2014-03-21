

/*
 * Interacting with cloud resources. This will be a resource, using the resource API.
 * Want to be able to be able to start up Amazon machines, access them, and get them to run code.
 * Hopefully control will be good enough to get them to download and build the necessary code and then get up and running as a node for this system.
 * 
 * Want to be able to get networks of machines running quickly, doing a test, recording the results, and then stopping.
 * May use Amazon spot prices and look out for them.
 * 
 * In a way, this is queueing up computation.
 * There may be some kind of interpreter that takes instructions... not ideal but it would work.
 *  Can't really do that in machine code right now, but I think it should run fairly quickly in JavaScript.
 *  
 * This will need to do quite a lot of things to use the Amazon service correctly.
 * It would also be good having this integrated with a local credentials storage system.
 * Perhaps more needs to be done on configuring local / cloud machines.
 * 
 * The remote config won't be unique to Amazon.
 * 
 * Could have ways to bring servers online, bringing them into this management system.
 * Would be able to view CPU usage, processes running etc on those servers because that local information would be made available as a shared resource.
 * 
 *   
 * 
 * 
 * 
 * 
 * 
 * */
