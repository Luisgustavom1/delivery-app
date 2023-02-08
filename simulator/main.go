package main

import (
	"log"
	kafkaProducer "simulator/app/kafka"
	"simulator/infra/kafka"


	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error on loading .env file")
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	consumer := kafka.NewKafkaConsumer(msgChan)
	go consumer.Consume()

	for msg := range msgChan {
		log.Println(string(msg.Value))
		go kafkaProducer.Produce(msg)
	}
}
