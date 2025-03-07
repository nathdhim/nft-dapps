const burgerNav = () => {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
}
const connected = async () => {
    Moralis.enable();
    connectMetamaskBtn.style.display = 'none';
    metamaskBtn.style.display = 'inherit';
    metamaskBtn.innerHTML = ethereum.selectedAddress.substr(0,10) + '...';
    setCookie("CONNECTED_WALLET", true, 30);
}
const connect = async () => {
    connectMetamaskBtn.classList.add("is-loading");
    var user = await Moralis.Web3.authenticate();
    connectMetamaskBtn.classList.remove("is-loading");
    if (user) {
        connected();
        location.reload();
    }
}
const disconnect = async () => {
    removeCookie("CONNECTED_WALLET");
    location.reload();
}
const tokenInfo = async () => {
    explorerBtn.classList.add('is-loading');
    let token = await web3api.get(`/nft/${CONTRACT_ADDRESS}/metadata`);
    explorerBtn.innerHTML = `<strong>${token.name}</strong> (${token.symbol})`;
    explorerBtn.classList.remove('is-loading');
}
export default {
    render: async () => {
        let view =  /*html*/`
            <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/#/">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/NFT_Icon.png/480px-NFT_Icon.png">
                        </a>

                        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu" aria-expanded="false">
                        <div class="navbar-start">
                            <a class="navbar-item" href="/#/">
                                Home
                            </a>
                            <a class="navbar-item" href="/#/mint">
                                Mint NFT
                            </a>
                            <a class="navbar-item" href="/#/my-nfts">
                                My NFTs
                            </a>
                        </div>
                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-warning" target="_blank" id="explorerBtn" href="${EXPLORER}/token/${CONTRACT_ADDRESS}"></a>
                                    <button class="button" id="connectMetamaskBtn" type="button">
                                        <strong>Connect to Metamask</strong>
                                    </button>
                                </div>
                            </div>
                            <div class="navbar-item has-dropdown is-hoverable">
                                <a id="metamaskBtn" class="navbar-link">asd</a>
                                <div class="navbar-dropdown">
                                    <a target="_blank" href="${EXPLORER}/address/${ethereum.selectedAddress}" class="navbar-item">
                                        Explorer
                                    </a>
                                    <hr class="navbar-divider">
                                    <a id="disconnectMetamaskBtn" class="navbar-item">
                                        Disconnect
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `
        return view
    },
    after_render: async () => {
        burgerNav();
        tokenInfo();
        
        metamaskBtn.style.display = 'none';
        
        connectMetamaskBtn.addEventListener("click", function() {
            connect();
        });
        disconnectMetamaskBtn.addEventListener("click", function() {
            disconnect();
        });
        if (ethereum.selectedAddress && CONNECTED_WALLET) {
            connected();
        }
        window.ethereum.on('accountsChanged', function (accounts) {
            connected();
            location.reload();
        });
    }
}