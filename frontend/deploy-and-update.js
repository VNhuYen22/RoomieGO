const fs = require('fs');
const path = require('path');

async function main() {
    // Deploy contract
    const RentalContract = await ethers.getContractFactory("RentalContract");
    const rental = await RentalContract.deploy();
    await rental.waitForDeployment();
    
    console.log("RentalContract deployed to:", await rental.getAddress());
    
    // Update app.js with contract address
    const appJsPath = path.join(__dirname, 'app.js');
    let appJs = fs.readFileSync(appJsPath, 'utf8');
    
    appJs = appJs.replace(
        'const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";',
        `const contractAddress = "${await rental.getAddress()}";`
    );
    
    fs.writeFileSync(appJsPath, appJs);
    console.log("Updated app.js with contract address");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 