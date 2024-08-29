use tokio::net::{TcpListener, TcpStream};
use tokio::sync::mpsc;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("100.110.208.117").await.unwrap();
    println!("Server started at 100.110.208.117");

    loop {
        let (client_a, _) = listener.accept().await.unwrap();
        let (client_b, _) = listener.accept().await.unwrap();

        let (tx_a, rx_a) = mpsc::channel(1024);
        let (tx_b, rx_b) = mpsc::channel(1024);

        let handle_a = handle_client(client_a, rx_b, tx_a.clone());
        let handle_b = handle_client(client_b, rx_a, tx_b);

        tokio::spawn(async move {
            handle_a.await;
            handle_b.await;
        });
    }
}

async fn handle_client(mut stream: TcpStream, mut rx: mpsc::Receiver<Vec<u8>>, mut tx: mpsc::Sender<Vec<u8>>) {
    let (mut reader, mut writer) = stream.split();

    tokio::spawn(async move {
        loop {
            let mut buf = vec![0; 1024];
            let n = match reader.read(&mut buf).await {
                Ok(n) if n == 0 => return,
                Ok(n) => n,
                Err(_) => return,
            };
            let data = &buf[..n];
            tx.send(data.to_vec()).await.unwrap();
        }
    });

    while let Some(data) = rx.recv().await {
        writer.write_all(&data).await.unwrap();
        writer.flush().await.unwrap();
    }
}