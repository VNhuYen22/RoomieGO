// Contract ABI và Address
const contractABI = [
    "function createRental(string memory _contractId, string memory _tenantName, string memory _landlordName, string memory _contractImageHash) public",
    "function getRental(string memory _contractId) public view returns (string memory tenantName, string memory landlordName, string memory contractId, string memory contractImageHash, address creator, uint256 timestamp)",
    "function getAllContractIds() public view returns (string[] memory)",
    "function getUserContracts(address _user) public view returns (string[] memory)"
];

// Thay đổi địa chỉ contract sau khi deploy
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

let provider;
let signer;
let contract;

// Kết nối wallet
async function connectWallet() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            
            const account = await signer.getAddress();
            document.getElementById('account').textContent = `Đã kết nối: ${account}`;
        } else {
            alert('Vui lòng cài đặt MetaMask!');
        }
    } catch (error) {
        console.error('Lỗi kết nối wallet:', error);
        showError('createResult', 'Lỗi kết nối wallet: ' + error.message);
    }
}

// Tạo hợp đồng mới
async function createRental() {
    const contractId = document.getElementById('contractId').value;
    const tenantName = document.getElementById('tenantName').value;
    const landlordName = document.getElementById('landlordName').value;
    const imageHash = document.getElementById('imageHash').value;

    try {
        if (!contract) {
            await connectWallet();
        }

        const tx = await contract.createRental(contractId, tenantName, landlordName, imageHash);
        showResult('createResult', `Đang tạo hợp đồng... TX: ${tx.hash}`);
        
        await tx.wait();
        showResult('createResult', `✅ Tạo hợp đồng thành công! Mã: ${contractId}`);
        
        // Clear form
        document.getElementById('contractId').value = '';
        document.getElementById('tenantName').value = '';
        document.getElementById('landlordName').value = '';
        document.getElementById('imageHash').value = '';
    } catch (error) {
        console.error('Lỗi tạo hợp đồng:', error);
        showError('createResult', 'Lỗi: ' + error.message);
    }
}

// Lấy thông tin hợp đồng
async function getRental() {
    const searchId = document.getElementById('searchId').value;

    try {
        if (!contract) {
            await connectWallet();
        }

        const result = await contract.getRental(searchId);
        const timestamp = new Date(result.timestamp * 1000);
        
        const html = `
            <h3>📋 Thông tin Hợp đồng: ${result.contractId}</h3>
            <p><strong>Người thuê:</strong> ${result.tenantName}</p>
            <p><strong>Người cho thuê:</strong> ${result.landlordName}</p>
            <p><strong>Hash ảnh:</strong> ${result.contractImageHash}</p>
            <p><strong>Người tạo:</strong> ${result.creator}</p>
            <p><strong>Thời gian tạo:</strong> ${timestamp.toLocaleString('vi-VN')}</p>
        `;
        showResult('rentalResult', html);
    } catch (error) {
        console.error('Lỗi lấy hợp đồng:', error);
        showError('rentalResult', 'Không tìm thấy hợp đồng hoặc có lỗi: ' + error.message);
    }
}

// Lấy tất cả hợp đồng
async function getAllContracts() {
    try {
        if (!contract) {
            await connectWallet();
        }

        const contractIds = await contract.getAllContractIds();
        
        if (contractIds.length === 0) {
            showResult('allContracts', 'Chưa có hợp đồng nào.');
            return;
        }

        let html = '<h3>📝 Danh sách tất cả hợp đồng:</h3><ul>';
        contractIds.forEach(id => {
            html += `<li>${id}</li>`;
        });
        html += '</ul>';
        
        showResult('allContracts', html);
    } catch (error) {
        console.error('Lỗi lấy danh sách:', error);
        showError('allContracts', 'Lỗi: ' + error.message);
    }
}

// Helper functions
function showResult(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = message;
    element.style.display = 'block';
    element.className = 'result';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = message;
    element.style.display = 'block';
    element.className = 'result error';
}

// Auto connect on page load
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectWallet();
        }
    }
}); 