package kafka

import (
	"fmt"
	"log"
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaConsumer struct {
	MsgChan chan *ckafka.Message
}

func NewKafkaConsumer(msgChan chan *ckafka.Message) *KafkaConsumer {
	return &KafkaConsumer{
		MsgChan: msgChan,
	}
}

func (k *KafkaConsumer) Consume() {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KafkaBootstrapServers"),
		"group.id":          os.Getenv("KafkaConsumerGroupId"),
	}
	consumer, err := ckafka.NewConsumer(configMap)
	if err != nil {
		log.Fatal("error consuming kafka message " + err.Error())
	}
	topics := []string{os.Getenv("KafkaReadTopic")}
	consumer.SubscribeTopics(topics, nil)
	fmt.Println("Kafka consumer has been started")

	for {
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			k.MsgChan <- msg
		}
	}
}
